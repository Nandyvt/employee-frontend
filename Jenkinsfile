pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_REGION             = 'ap-south-2'
        S3_BUCKET              = 'nandy-employee-frontend'
        VITE_API_BASE_URL      = 'http://16.112.109.82/api'
        APP_SERVER_HOST         = '16.112.109.82'   // update after every app-instance restart
        APP_SERVER_USER         = 'ec2-user'
        APP_REPO_PATH           = '/home/ec2-user/employee-crud-api'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        // ---------------- BACKEND: triggered remotely on Instance A ----------------
        stage('Backend: Remote rebuild + restart') {
            when { expression { fileExists('server.js') } }
            steps {
                sshagent(credentials: ['app-server-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ${APP_SERVER_USER}@${APP_SERVER_HOST} "
                            cd ${APP_REPO_PATH} &&
                            git pull origin develop &&
                            docker build -t employee-crud-api:latest . &&
                            docker stop employee-crud-api || true &&
                            docker rm employee-crud-api || true &&
                            docker run -d --name employee-crud-api --restart unless-stopped \
                              -p 3000:3000 --env-file ${APP_REPO_PATH}/.env.production \
                              employee-crud-api:latest
                        "
                    '''
                }
            }
        }

        // ---------------- FRONTEND: built locally on the Jenkins instance ----------------
        stage('Frontend: Build') {
            when { expression { fileExists('vite.config.js') } }
            steps {
                sh '''
                    docker build \
                      --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL \
                      -t employee-frontend-build:latest .
                '''
            }
        }

        stage('Frontend: Extract dist/') {
            when { expression { fileExists('vite.config.js') } }
            steps {
                sh '''
                    docker create --name extract-frontend employee-frontend-build:latest
                    rm -rf dist_output && mkdir dist_output
                    docker cp extract-frontend:/app/dist/. dist_output/
                    docker rm extract-frontend
                '''
            }
        }

        stage('Frontend: Sync to S3') {
            when { expression { fileExists('vite.config.js') } }
            steps {
                sh '''
                    aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
                    aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
                    aws configure set region "$AWS_REGION"
                    aws s3 sync dist_output/ s3://$S3_BUCKET --delete
                '''
            }
        }
    }

    post {
        success { echo 'Pipeline finished successfully.' }
        failure { echo 'Pipeline failed — check the stage logs above.' }
    }
}