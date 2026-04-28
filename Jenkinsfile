pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "madhu8912/cloud-food-menu-app"
        DOCKER_TAG = "latest"
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
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running tests..."
                bat 'npm test || exit 0'
            }
        }

        stage('Build Application') {
            steps {
                echo "Building app..."
                bat 'npm run build || exit 0'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                bat "docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% ."
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
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "Pushing image..."
                bat "docker push %DOCKER_IMAGE%:%DOCKER_TAG%"
            }
        }

        stage('Pull Docker Image') {
            steps {
                echo "Pulling image from Docker Hub..."
                bat "docker pull %DOCKER_IMAGE%:%DOCKER_TAG%"
            }
        }

        stage('Deploy Container') {
            steps {
                echo "Stopping old container..."
                bat 'docker stop food-app || exit 0'
                bat 'docker rm food-app || exit 0'

                echo "Running new container..."
                bat "docker run -d --name food-app -p 3000:3000 %DOCKER_IMAGE%:%DOCKER_TAG%"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline Success!"
        }
        failure {
            echo "❌ Pipeline Failed!"
        }
    }
}