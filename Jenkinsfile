pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-food-menu-app"
        VERSION = "v1.${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                bat '''
                echo ===== BUILD START =====
                docker build -t %IMAGE_NAME%:%VERSION% .
                echo ===== BUILD COMPLETE =====
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat '''
                    docker logout
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Push Image') {
            steps {
                bat '''
                docker push %IMAGE_NAME%:%VERSION%

                docker tag %IMAGE_NAME%:%VERSION% %IMAGE_NAME%:latest
                docker push %IMAGE_NAME%:latest

                echo Release Version: %VERSION%
                '''
            }
        }

        stage('Docker Pull Test') {
            steps {
                bat "docker pull %IMAGE_NAME%:%VERSION%"
            }
        }

        // ================= GREEN DEPLOY =================

        stage('Start New Container (Green)') {
            steps {
                bat '''
                echo ===== CLEAN PORT 8086 =====

                for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8086') do (
                    taskkill /F /PID %%a || echo No process
                )

                docker stop food-app-green || echo not running
                docker rm food-app-green || echo not exists

                echo ===== START GREEN =====
                docker run -d -p 8086:5000 --name food-app-green ^
                -e VERSION=%VERSION% ^
                %IMAGE_NAME%:%VERSION%

                docker ps | findstr food-app-green || exit 1
                '''
            }
        }

        stage('Container Logs (Green)') {
            steps {
                bat '''
                echo ===== GREEN LOGS =====
                docker logs food-app-green || echo no logs
                '''
            }
        }

        stage('Health Check (Green)') {
            steps {
                bat '''
                echo ===== WAIT FOR APP =====
                ping 127.0.0.1 -n 20 >nul

                echo ===== HEALTH CHECK GREEN =====
                curl http://localhost:8086/api/restaurants

                IF %ERRORLEVEL% NEQ 0 (
                    echo ❌ Green failed
                    docker logs food-app-green
                    exit /b 1
                )
                '''
            }
        }

        // ================= SWITCH TRAFFIC =================

        stage('Switch Traffic') {
            steps {
                script {
                    def status = bat(
                        script: 'curl -s http://localhost:8086/api/restaurants',
                        returnStatus: true
                    )

                    if (status == 0) {
                        echo "✅ Green healthy → Switching"

                        bat '''
                        echo ===== CLEAN PORT 8085 =====

                        for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8085') do (
                            taskkill /F /PID %%a || echo No process
                        )

                        docker stop food-app || echo not running
                        docker rm food-app || echo not exists

                        echo ===== START LIVE =====
                        docker run -d -p 8085:5000 --name food-app ^
                        -e VERSION=%VERSION% ^
                        %IMAGE_NAME%:%VERSION%

                        docker ps | findstr food-app || exit 1
                        '''
                    } else {
                        error("❌ Green failed → rollback")
                    }
                }
            }
        }

        // ================= FINAL CHECK =================

        stage('Final Health Check') {
            steps {
                bat '''
                echo ===== FINAL CHECK =====
                ping 127.0.0.1 -n 10 >nul

                curl http://localhost:8085/api/restaurants

                IF %ERRORLEVEL% NEQ 0 (
                    echo ❌ Live failed
                    docker logs food-app
                    exit /b 1
                )
                '''
            }
        }

        // ================= MONITORING =================

        stage('Docker Monitoring') {
            steps {
                bat '''
                echo ===== RUNNING CONTAINERS =====
                docker ps

                echo ===== RESOURCE USAGE =====
                docker stats --no-stream
                '''
            }
        }

        // ================= LOGS SAVE =================

        stage('Save Logs') {
            steps {
                bat '''
                docker logs food-app > live-logs.txt
                docker logs food-app-green > green-logs.txt
                '''
                archiveArtifacts artifacts: '*.txt'
            }
        }

        // ================= REPORT =================

        stage('Build Report') {
            steps {
                bat '''
                echo ===== RELEASE REPORT ===== > build-report.txt
                echo Version: %VERSION% >> build-report.txt
                echo Image: %IMAGE_NAME% >> build-report.txt
                echo Live URL: http://localhost:8085 >> build-report.txt
                echo Green URL: http://localhost:8086 >> build-report.txt
                echo Status: SUCCESS >> build-report.txt
                '''
                archiveArtifacts artifacts: 'build-report.txt'
            }
        }
    }

    // ================= ROLLBACK =================

    post {
        failure {
            echo "❌ Deployment Failed → Rolling Back"

            bat '''
            echo ===== ROLLBACK =====

            docker stop food-app-green || echo ignore
            docker rm food-app-green || echo ignore

            echo Old version still running on 8085 ✅
            '''
        }

        success {
            echo "✅ Deployment Successful"
        }
    }
}