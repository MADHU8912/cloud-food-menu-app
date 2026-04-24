pipeline {
    agent any

    environment {
        IMAGE_NAME = 'nikhilabba12/cloud-food-menu-app'
        IMAGE_TAG = 'latest'
        RENDER_DEPLOY_HOOK = 'PASTE_YOUR_REAL_RENDER_HOOK'
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

        stage('Docker Pull Test') {
    steps {
        bat 'docker pull %IMAGE_NAME%:%IMAGE_TAG%'
    }
}

stage('Deploy to Render') {
    steps {
        bat '''
        curl -X POST "https://api.render.com/deploy/srv-d7lg0bnlk1mc73b6tnvg?key=g8v4QHrHO4o"
        '''
    }
}

stage('Run Container Local') {
    steps {
        bat '''
        docker stop food-app || echo not running
        docker rm food-app || echo not exists
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
        echo Render Deploy Triggered Successfully >> build-report.txt
        '''
        archiveArtifacts artifacts: 'build-report.txt', fingerprint: true
    }
}