pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-food-menu-app"
        IMAGE_TAG = "v1.${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
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
                    bat """
                    docker logout
                    docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                bat """
                docker push %IMAGE_NAME%:%IMAGE_TAG%
                docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:latest
                docker push %IMAGE_NAME%:latest
                """
            }
        }

        // ✅ NEW STAGE
        stage('Docker Pull Test') {
            steps {
                bat """
                docker pull %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        stage('Deploy to Render') {
            steps {
                bat 'curl -X POST "https://api.render.com/deploy/YOUR_HOOK_URL"'
            }
        }

        stage('Run Container Local') {
            steps {
                bat """
                docker stop food-app || echo not running
                docker rm food-app || echo not exists

                docker run -d -p 8085:5000 --name food-app %IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        stage('Health Check') {
    steps {
        bat """
        echo Waiting for app...
        ping 127.0.0.1 -n 30 >nul

        echo Running containers:
        docker ps

        echo Testing API:
        curl -f http://localhost:8085 || exit 1
        """
    }
}
        stage('Build Report') {
    steps {
        bat """
        echo Build Success > "%WORKSPACE%\\build-report.txt"
        echo Image: %IMAGE_NAME%:%IMAGE_TAG% >> "%WORKSPACE%\\build-report.txt"
        echo URL: http://localhost:8085 >> "%WORKSPACE%\\build-report.txt"
        """
        archiveArtifacts artifacts: 'build-report.txt'
    }
}

    post {
        success {
            echo 'Pipeline SUCCESS ✅'
        }
        failure {
            echo 'Pipeline FAILED ❌'
        }
    }
}