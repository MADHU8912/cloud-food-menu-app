pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-food-menu-app"
        VERSION = "v${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/MADHU8912/cloud-food-menu-app.git'
            }
        }

        stage('Docker Build') {
            steps {
                bat "docker build -t %IMAGE_NAME%:%VERSION% ."
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    bat "docker login -u %USER% -p %PASS%"
                }
            }
        }

        stage('Push Image') {
            steps {
                bat "docker push %IMAGE_NAME%:%VERSION%"
                bat "docker tag %IMAGE_NAME%:%VERSION% %IMAGE_NAME%:latest"
                bat "docker push %IMAGE_NAME%:latest"
            }
        }

        stage('Docker Pull Test') {
            steps {
                bat "docker pull %IMAGE_NAME%:%VERSION%"
            }
        }

        stage('Start New Container') {
            steps {
                bat """
                docker stop food-app-green || echo not running
                docker rm food-app-green || echo not exists
                docker run -d -p 8086:5000 --name food-app-green %IMAGE_NAME%:%VERSION%
                """
            }
        }

        stage('Health Check New') {
            steps {
                bat """
                ping 127.0.0.1 -n 10 >nul
                curl -f http://localhost:8086/api/restaurants || exit 1
                """
            }
        }

        stage('Switch Traffic') {
            steps {
                bat """
                docker stop food-app-blue || echo no old container
                docker rm food-app-blue || echo no old container
                docker rename food-app-green food-app-blue

                docker stop food-app || echo ignore
                docker rm food-app || echo ignore

                docker run -d -p 8085:5000 --name food-app %IMAGE_NAME%:%VERSION%
                """
            }
        }

        stage('Deploy to Render') {
            steps {
                bat 'curl -X POST "https://api.render.com/deploy/YOUR_REAL_HOOK_URL"'
            }
        }

        stage('Final Health Check') {
            steps {
                bat """
                ping 127.0.0.1 -n 10 >nul
                curl -f http://localhost:8085/api/restaurants || exit 1
                """
            }
        }

        stage('Build Report') {
            steps {
                bat """
                echo SUCCESS > build-report.txt
                echo Version: %VERSION% >> build-report.txt
                echo URL: http://localhost:8085 >> build-report.txt
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
