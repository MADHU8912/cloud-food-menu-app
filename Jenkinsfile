pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-food-menu-app"
        IMAGE_TAG = "v${BUILD_NUMBER}"
        CONTAINER_GREEN = "food-app-green"
        CONTAINER_BLUE = "food-app-blue"
        LIVE_CONTAINER = "food-app"
        PORT_GREEN = "8086"
        PORT_BLUE = "8085"
    }

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/MADHU8912/cloud-food-menu-app.git', branch: 'main'
            }
        }

        stage('Docker Build') {
            steps {
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat """
                    docker logout
                    echo %PASS% | docker login -u %USER% --password-stdin
                    """
                }
            }
        }

        stage('Push Image') {
            steps {
                bat """
                docker push %IMAGE_NAME%:%IMAGE_TAG%
                docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:latest
                docker push %IMAGE_NAME%:latest
                """
            }
        }

        stage('Docker Pull Test') {
            steps {
                bat "docker pull %IMAGE_NAME%:%IMAGE_TAG%"
            }
        }

        stage('Start New Container (Green)') {
            steps {
                bat """
                echo Cleaning old green container...
                docker stop %CONTAINER_GREEN% || echo not running
                docker rm %CONTAINER_GREEN% || echo not exists

                echo Starting new green container...
                docker run -d -p %PORT_GREEN%:5000 --name %CONTAINER_GREEN% %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        stage('Health Check Green') {
            steps {
                bat """
                ping 127.0.0.1 -n 10 > nul
                curl -f http://localhost:%PORT_GREEN%/api/restaurants || exit 1
                """
            }
        }

        stage('Switch Traffic (Blue-Green)') {
            steps {
                bat """
                echo Removing old blue...
                docker stop %CONTAINER_BLUE% || echo no old container
                docker rm %CONTAINER_BLUE% || echo no old container

                echo Renaming green -> blue...
                docker rename %CONTAINER_GREEN% %CONTAINER_BLUE%

                echo Replacing live container...
                docker stop %LIVE_CONTAINER% || echo ignore
                docker rm %LIVE_CONTAINER% || echo ignore

                docker run -d -p %PORT_BLUE%:5000 --name %LIVE_CONTAINER% %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        stage('Final Health Check') {
            steps {
                bat """
                ping 127.0.0.1 -n 10 > nul
                curl -f http://localhost:%PORT_BLUE%/api/restaurants || exit 1
                """
            }
        }

        stage('Deploy to Render') {
            steps {
                bat """
                curl -X POST "https://api.render.com/deploy/YOUR_REAL_HOOK_URL"
                """
            }
        }

        stage('Build Report') {
            steps {
                bat """
                echo SUCCESS > build-report.txt
                echo Version: %IMAGE_TAG% >> build-report.txt
                echo URL: http://localhost:%PORT_BLUE% >> build-report.txt
                """
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