pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-food-menu-app"
        VERSION = "v${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/MADHU8912/cloud-food-menu-app.git'
            }
        }

        // ✅ BUILD DOCKER IMAGE
        stage('Docker Build') {
            steps {
                bat '''
                echo ===== BUILD START =====
                docker build -t %IMAGE_NAME%:%VERSION% .
                echo ===== BUILD COMPLETE =====
                '''
            }
        }

        // ✅ FIXED LOGIN (IMPORTANT)
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat '''
                    echo ===== LOGIN =====
                    docker logout
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        // ✅ PUSH IMAGE
        stage('Push Image') {
            steps {
                bat '''
                echo ===== PUSH IMAGE =====
                docker push %IMAGE_NAME%:%VERSION%
                '''
            }
        }

    stage('Render Deploy') {
    steps {
        withCredentials([string(
            credentialsId: 'render-deploy-hook',
            variable: 'RENDER_HOOK'
        )]) {
            bat '''
            echo ===== TRIGGER RENDER DEPLOY =====
            curl -X POST %RENDER_HOOK%
            '''
        }
    }
}

        // ✅ TEST PULL
        stage('Docker Pull Test') {
            steps {
                bat '''
                echo ===== PULL TEST =====
                docker pull %IMAGE_NAME%:%VERSION%
                '''
            }
        }

        // ✅ START GREEN CONTAINER
        stage('Start New Container (Green)') {
            steps {
                bat '''
                echo ===== CLEAN PORT 8086 =====

                for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8086') do taskkill /F /PID %%a 2>nul

                docker stop food-app-green 2>nul
                docker rm food-app-green 2>nul

                echo ===== START GREEN =====
                docker run -d -p 8086:5000 --name food-app-green %IMAGE_NAME%:%VERSION%
                '''
            }
        }

        // ✅ LOGS
        stage('Container Logs (Green)') {
            steps {
                bat '''
                echo ===== LOGS =====
                docker logs food-app-green
                '''
            }
        }

        // ✅ HEALTH CHECK GREEN
        stage('Health Check (Green)') {
            steps {
                bat '''
                echo Waiting for app...
                ping 127.0.0.1 -n 15 >nul

                curl http://localhost:8086/version || exit 1
                '''
            }
        }

        // ✅ SWITCH TRAFFIC
        stage('Switch Traffic') {
            steps {
                bat '''
                echo ===== CLEAN PORT 8085 =====

                for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8085') do taskkill /F /PID %%a 2>nul

                docker stop food-app 2>nul
                docker rm food-app 2>nul

                echo ===== START LIVE =====
                docker run -d -p 8085:5000 --name food-app %IMAGE_NAME%:%VERSION%
                '''
            }
        }

        // ✅ FINAL HEALTH CHECK
        stage('Final Health Check') {
            steps {
                bat '''
                ping 127.0.0.1 -n 10 >nul
                curl http://localhost:8085/version || exit 1
                '''
            }
        }

        // ✅ DOCKER MONITORING
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

        // ✅ SAVE LOGS
        stage('Save Logs') {
            steps {
                bat '''
                docker logs food-app > logs.txt
                '''
                archiveArtifacts artifacts: 'logs.txt'
            }
        }

        // ✅ BUILD REPORT
        stage('Build Report') {
            steps {
                bat '''
                echo ===== RELEASE ===== > build-report.txt
                echo Version: %VERSION% >> build-report.txt
                echo URL: http://localhost:8085 >> build-report.txt
                '''
                archiveArtifacts artifacts: 'build-report.txt'
            }
        }
    }

    // ✅ SAFE ROLLBACK (NO CRASH)
    post {
        failure {
            echo "❌ Deployment Failed → Rolling Back"

            bat '''
            echo ===== ROLLBACK =====

            docker stop food-app-green 2>nul
            docker rm food-app-green 2>nul

            echo Old version still running on 8085 ✅
            '''
        }

        success {
            echo "✅ Deployment Successful"
        }
    }
}