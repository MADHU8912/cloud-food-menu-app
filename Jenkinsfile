pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "madhu8912/cloud-food-menu-app"
        DOCKER_TAG = "latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "Cloning GitHub repository..."
                git url: 'https://github.com/MADHU8912/cloud-food-menu-app.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies..."
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running tests..."
                sh 'npm test || true'
            }
        }

        stage('Build Application') {
            steps {
                echo "Building app..."
                sh 'npm run build || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "Pushing image to Docker Hub..."
                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }

        stage('Deploy Container') {
            steps {
                echo "Stopping old container if exists..."
                sh '''
                    docker stop food-app || true
                    docker rm food-app || true
                '''

                echo "Running new container..."
                sh "docker run -d --name food-app -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline executed successfully!"
        }

        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}