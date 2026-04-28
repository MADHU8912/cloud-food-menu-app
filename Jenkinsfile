pipeline {
    agent any

    environment {
        IMAGE_NAME = "madhu8912/cloud-food-menu-app"
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/MADHU8912/cloud-food-menu-app.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies..."
                bat "npm install"
            }
        }

        stage('Run Tests') {
            steps {
                echo "No test script found - skipping tests safely"
            }
        }

        stage('Build Application') {
            steps {
                echo "No build script found - skipping build (backend project)"
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS')]) {

                    bat """
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "Pushing Docker image..."
                bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
            }
        }

        stage('Pull Docker Image') {
            steps {
                echo "Pulling Docker image..."
                bat "docker pull %IMAGE_NAME%:%IMAGE_TAG%"
            }
        }

        stage('Deploy Container') {
            steps {
                echo "Deploying container..."

                bat """
                docker stop food-app || exit 0
                docker rm food-app || exit 0
                docker run -d -p 3000:3000 --name food-app %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline SUCCESS - App deployed successfully"
        }

        failure {
            echo "❌ Pipeline FAILED - Check logs"
        }
    }
}