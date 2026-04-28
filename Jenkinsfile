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
                    docker login -u %DOCKER_USER% -p %DOCKER_PASS%
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

        stage('Start New Container') {
            steps {
                bat '''
                docker stop food-app-green || echo not running
                docker rm food-app-green || echo not exists

                docker run -d -p 8086:5000 --name food-app-green %IMAGE_NAME%:%VERSION%
                '''
            }
        }

        stage('Container Logs') {
            steps {
                bat '''
                echo ===== CONTAINER LOGS =====
                docker logs food-app-green || echo no logs
                '''
            }
        }

        stage('Health Check New') {
            steps {
                bat '''
                echo Waiting for app to start...
                ping 127.0.0.1 -n 15 >nul

                echo Checking API...
                curl http://localhost:8086/api/restaurants || exit 1
                '''
            }
        }

        stage('Switch Traffic') {
            steps {
                bat '''
                docker stop food-app-blue || echo no old container
                docker rm food-app-blue || echo no old container

                docker rename food-app-green food-app-blue || echo rename skipped

                docker stop food-app || echo ignore
                docker rm food-app || echo ignore

                docker run -d -p 8085:5000 --name food-app %IMAGE_NAME%:%VERSION%
                '''
            }
        }

        stage('Final Health Check') {
            steps {
                bat '''
                ping 127.0.0.1 -n 10 >nul
                curl http://localhost:8085/api/restaurants || exit 1
                '''
            }
        }

        stage('Build Report') {
            steps {
                bat '''
                echo ===== RELEASE REPORT ===== > build-report.txt
                echo Version: %VERSION% >> build-report.txt
                echo Image: %IMAGE_NAME% >> build-report.txt
                echo URL: http://localhost:8085 >> build-report.txt
                echo Status: SUCCESS >> build-report.txt
                '''
                archiveArtifacts artifacts: 'build-report.txt'
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful"
        }
        failure {
            echo "❌ Deployment Failed"
        }
    }
}