pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_REGION                 = 'ap-south-2'
        S3_BUCKET                  = 'nandy-employee-frontend'
        VITE_API_BASE_URL          = 'http://a4aebf8441c10474cbc19fc208d56cc8-1396253925.ap-south-2.elb.amazonaws.com/api'
        CLOUDFRONT_DISTRIBUTION_ID = 'E8H9BFDWXL8T1'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build') {
            steps {
                sh '''
                    docker build \
                      --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL \
                      -t employee-frontend-build:latest .
                '''
            }
        }

        stage('Extract dist/') {
            steps {
                sh '''
                    docker create --name extract-frontend employee-frontend-build:latest
                    rm -rf dist_output && mkdir dist_output
                    docker cp extract-frontend:/app/dist/. dist_output/
                    docker rm extract-frontend
                '''
            }
        }

        stage('Sync to S3 + invalidate CloudFront') {
            steps {
                sh '''
                    aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
                    aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
                    aws configure set region "$AWS_REGION"
                    aws s3 sync dist_output/ s3://$S3_BUCKET --delete
                    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
                '''
            }
        }
    }

    post {
        success { echo 'Frontend deployed to S3/CloudFront successfully.' }
        failure { echo 'Pipeline failed — check the stage logs above.' }
    }
}