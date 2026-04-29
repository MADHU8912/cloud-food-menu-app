pipeline {
    agent any

    environment {
        IMAGE = "nikhilabba12/cloud-food-menu-app:latest"
    }

    stages {

        stage('Docker Build') {
            steps {
                sh '/usr/local/bin/docker build -t $IMAGE .'
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
                    echo $DOCKER_PASS | /usr/local/bin/docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                sh '/usr/local/bin/docker push $IMAGE'
            }
        }

        // ✅ NEW: Pull image (verification step)
        stage('Docker Pull') {
            steps {
                sh '/usr/local/bin/docker pull $IMAGE'
            }
        }

        // ✅ NEW: Deploy to Render
        stage('Deploy to Render') {
            steps {
                withCredentials([string(credentialsId: 'render-api-key', variable: 'RENDER_API')]) {
                    sh '''
                    curl -X POST https://api.render.com/deploy/srv-xxxxx \
                    -H "Authorization: Bearer $RENDER_API"
                    '''
                }
            }
        }
    }
}