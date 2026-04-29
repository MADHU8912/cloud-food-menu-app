pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-food-menu-app"
        IMAGE_TAG = "v1.${BUILD_NUMBER}"
        RENDER_SERVICE_URL = "https://your-render-url.onrender.com"
    }

    stages {

        stage('Docker Check') {
            steps {
                bat "docker ps"
            }
        }

        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/MADHU8912/cloud-food-menu-app.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat "npm install"
            }
        }

        stage('Docker Build') {
            steps {
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                }
            }
        }

        stage('Docker Push') {
            steps {
                bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
                bat "docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:latest"
                bat "docker push %IMAGE_NAME%:latest"
            }
        }

        stage('Deploy Local') {
            steps {
                bat """
                docker stop food-app 2>nul
                docker rm food-app 2>nul
                docker run -d -p 8085:5000 --name food-app %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        stage('Health Check') {
            steps {
                bat """
                powershell -Command "Start-Sleep -Seconds 10; Invoke-WebRequest http://localhost:8085/api/restaurants"
                """
            }
        }
    }
}