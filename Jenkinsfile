pipeline {
    agent any

    environment {
        IMAGE_NAME = 'nikhilabba12/cloud-food-menu-app'
        IMAGE_TAG = 'latest'
        RENDER_DEPLOY_HOOK = 'https://api.render.com/deploy/srv-xxxxx?key=xxxx'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Files') {
            steps {
                bat 'dir'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
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
                    docker logout
                    docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                bat 'docker push %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Docker Pull Test') {
            steps {
                bat 'docker pull %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Deploy to Render') {
            steps {
                bat 'curl -X POST "%RENDER_DEPLOY_HOOK%"'
            }
        }

        stage('Run Container Local') {
    steps {
        bat '''
        docker rm -f food-app || echo no old container
        docker run -d -p 8085:80 --name food-app %IMAGE_NAME%:%IMAGE_TAG%
        '''
    }
}
stage('Build Report') {
    steps {
        bat '''
        echo CI/CD Pipeline Completed Successfully > build-report.txt
        echo Docker Image: nikhilabba12/cloud-food-menu-app:latest >> build-report.txt
        echo Local URL: http://localhost:8085 >> build-report.txt
        echo Render URL: https://your-render-app-name.onrender.com >> build-report.txt
        '''
        archiveArtifacts artifacts: 'build-report.txt', fingerprint: true
    }
}