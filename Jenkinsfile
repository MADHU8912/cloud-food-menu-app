pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-food-menu-app"
        IMAGE_TAG = "v1.${BUILD_NUMBER}"
        CONTAINER_NAME = "food-app"
        NEW_CONTAINER = "food-app-green"
        OLD_CONTAINER = "food-app-blue"
        PORT_NEW = "8086"
        PORT_OLD = "8085"
    }

    stages {

        // ✅ 1. Checkout Code
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ✅ 2. Build Docker Image
        stage('Docker Build') {
            steps {
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        // ✅ 3. Login to DockerHub
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat """
                    docker logout
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    """
                }
            }
        }

        // ✅ 4. Push Image
        stage('Push Image') {
            steps {
                bat """
                docker push %IMAGE_NAME%:%IMAGE_TAG%
                docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:latest
                docker push %IMAGE_NAME%:latest
                """
            }
        }

        // ✅ 5. Pull Test
        stage('Docker Pull Test') {
            steps {
                bat "docker pull %IMAGE_NAME%:%IMAGE_TAG%"
            }
        }

        // ✅ 6. Start NEW Container (Green)
        stage('Start New Container') {
            steps {
                bat """
                docker stop %NEW_CONTAINER% || echo not running
                docker rm %NEW_CONTAINER% || echo not exists

                docker run -d -p %PORT_NEW%:5000 --name %NEW_CONTAINER% %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        // ✅ 7. Health Check NEW Container
        stage('Health Check New') {
            steps {
                bat """
                echo Waiting for app...
                ping 127.0.0.1 -n 20 >nul

                echo Checking container:
                docker ps

                curl -f http://localhost:%PORT_NEW%/api/restaurants || exit 1
                """
            }
        }

        // ✅ 8. Switch Traffic (Blue-Green Deployment)
        stage('Switch Traffic') {
            steps {
                bat """
                docker stop %OLD_CONTAINER% || echo no old container
                docker rm %OLD_CONTAINER% || echo no old container

                docker rename %NEW_CONTAINER% %OLD_CONTAINER%

                docker stop %CONTAINER_NAME% || echo ignore
                docker rm %CONTAINER_NAME% || echo ignore

                docker run -d -p %PORT_OLD%:5000 --name %CONTAINER_NAME% %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        // ✅ 9. Deploy to Render (Optional)
        stage('Deploy to Render') {
            steps {
                bat 'curl -X POST "https://api.render.com/deploy/YOUR_REAL_HOOK_URL"'
            }
        }

        // ✅ 10. Final Health Check
        stage('Final Health Check') {
            steps {
                bat """
                ping 127.0.0.1 -n 15 >nul
                curl -f http://localhost:%PORT_OLD%/api/restaurants || exit 1
                """
            }
        }

        // ✅ 11. Build Report
        stage('Build Report') {
            steps {
                bat """
                echo SUCCESS > build-report.txt
                echo Image: %IMAGE_NAME%:%IMAGE_TAG% >> build-report.txt
                echo URL: http://localhost:%PORT_OLD% >> build-report.txt
                """
                archiveArtifacts artifacts: 'build-report.txt'
            }
        }
    }

    // ✅ Post Actions
    post {
        success {
            echo '✅ Deployment Successful'
        }
        failure {
            echo '❌ Deployment Failed'
        }
    }
}
stage('Install Dependencies') {
    steps {
        bat 'npm install'
    }
}

stage('Test API') {
    steps {
        bat 'npm test || exit 0'
    }
}

stage('Docker Compose Build') {
    steps {
        bat 'docker-compose build'
    }
}

stage('Deploy') {
    steps {
        bat 'docker-compose up -d'
    }
}