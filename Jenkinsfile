pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-food-menu-app"
        IMAGE_TAG = "v1.${BUILD_NUMBER}"
        CONTAINER_NEW = "food-app-green"
        CONTAINER_OLD = "food-app-blue"
    }

    stages {

        stage('Checkout') {
            steps { checkout scm }
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
                    bat """
                    docker logout
                    docker login -u %DOCKER_USER% -p %DOCKER_PASS%
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

        // 🟢 START NEW VERSION (GREEN)
        stage('Start New Container') {
            steps {
                bat """
                docker stop %CONTAINER_NEW% || echo not running
                docker rm %CONTAINER_NEW% || echo not exists

                docker run -d -p 8086:5000 --name %CONTAINER_NEW% %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        // 🔍 HEALTH CHECK NEW
        stage('Health Check New') {
            steps {
                bat """
                ping 127.0.0.1 -n 10 >nul
                curl -f http://localhost:8086/api/restaurants || exit 1
                """
            }
        }

        // 🔁 SWITCH TRAFFIC
        stage('Switch Traffic') {
            steps {
                bat """
                docker stop %CONTAINER_OLD% || echo no old container
                docker rm %CONTAINER_OLD% || echo no old container

                docker rename %CONTAINER_NEW% %CONTAINER_OLD%

                docker stop food-app || echo ignore
                docker rm food-app || echo ignore

                docker run -d -p 8085:5000 --name food-app %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        // ☁️ DEPLOY TO CLOUD
        stage('Deploy to Render') {
            steps {
                bat 'curl -X POST "https://api.render.com/deploy/YOUR_HOOK_URL"'
            }
        }

        // ✅ FINAL HEALTH CHECK
        stage('Final Health Check') {
            steps {
                bat """
                ping 127.0.0.1 -n 10 >nul
                curl -f http://localhost:8085/api/restaurants || exit 1
                """
            }
        }

        // 📄 REPORT
        stage('Build Report') {
            steps {
                bat """
                echo SUCCESS > build-report.txt
                echo Version: %IMAGE_TAG% >> build-report.txt
                echo URL: http://localhost:8085 >> build-report.txt
                """
                archiveArtifacts artifacts: 'build-report.txt'
            }
        }
    }

    // 🔥 AUTO ROLLBACK IF FAILED
    post {
        failure {
            echo "❌ Deployment Failed - Rolling Back..."

            bat """
            docker stop food-app || echo ignore
            docker rm food-app || echo ignore

            docker run -d -p 8085:5000 --name food-app %IMAGE_NAME%:latest
            """
        }

        success {
            echo "✅ Deployment Successful"
        }
    }
}