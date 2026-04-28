pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-food-menu-app"
        IMAGE_TAG = "v1.${BUILD_NUMBER}"
        RENDER_SERVICE_URL = "https://your-render-url.onrender.com"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Cloning GitHub repository..."
                git url: 'https://github.com/MADHU8912/cloud-food-menu-app.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing dependencies..."
                bat "npm install"
            }
        }

        stage('Docker Build') {
            steps {
                echo "🐳 Building Docker image..."
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        stage('Docker Login') {
            steps {
                echo "🔐 Logging into Docker Hub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS')]) {

                    bat """
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    """
                }
            }
        }

        stage('Docker Push') {
            steps {
                echo "📤 Pushing image to Docker Hub..."
                bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"

                bat "docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:latest"
                bat "docker push %IMAGE_NAME%:latest"
            }
        }

        stage('Docker Pull Test') {
            steps {
                echo "📥 Testing image pull..."
                bat "docker pull %IMAGE_NAME%:%IMAGE_TAG%"
            }
        }

        stage('Deploy to Local Container') {
            steps {
                echo "🚀 Deploying container locally..."

                bat """
                docker stop food-app || exit 0
                docker rm food-app || exit 0
                docker run -d -p 8085:5000 --name food-app %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        stage('Health Check') {
            steps {
                echo "🧪 Checking application health..."
                bat "timeout /t 10"
                bat "curl http://localhost:8085/api/restaurants || exit 1"
            }
        }

        stage('Deploy to Render (Trigger)') {
            steps {
                echo "🌍 Triggering Render deployment..."

                bat """
                curl -X POST %RENDER_SERVICE_URL%
                """
            }
        }
    }

    post {
        success {
            echo "✅ PIPELINE SUCCESS: Build → Push → Deploy Completed"
        }

        failure {
            echo "❌ PIPELINE FAILED: Check logs"
        }
    }
}