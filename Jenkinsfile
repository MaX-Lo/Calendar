pipeline {
    agent { docker { image 'node:10.13.0' } }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'npm run build'
            }
        }
        stage('deploy' {
            steps {
                echo 'Deploying'
            }
        }
    }
    post {
        failure {
            mail to: 'lorenz_max@protonmail.com',
            subject: "Failed Pipeline: ${currentBuild.fullDisplayName",
            body: "Something is wrong with ${env.BUILD_URL}"
        }
    }
}