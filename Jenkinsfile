pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "nikhilabba12/cloud-food-menu-app"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/MADHU8912/cloud-food-menu-app.git'
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
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build -t $DOCKER_IMAGE .
                '''
            }
        }

        stage('Docker Tag') {
            steps {
                sh '''
                docker tag $DOCKER_IMAGE $DOCKER_IMAGE:latest
                '''
            }
        }

        stage('Docker Push') {
            steps {
                sh '''
                docker push $DOCKER_IMAGE:latest
                '''
            }
        }

        stage('Deploy to Render') {
            steps {
                echo "Deploy manually or via Render webhook"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}
cloud-food-menu-app
