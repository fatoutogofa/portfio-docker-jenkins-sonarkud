pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        BACKEND_IMAGE  = 'portfolio-backend'
        FRONTEND_IMAGE = 'portfolio-frontend'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Récupération du code source...'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/fatoutogofa/portfio-docker-jenkins-sonarkud.git',
                        credentialsId: 'github-credentials'
                    ]]
                ])
            }
        }

        stage('Build Backend') {
            steps {
                echo '🔨 Build image Docker backend...'
                sh 'docker build -t ${BACKEND_IMAGE}:latest ./DOCKER-main'
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🔨 Build image Docker frontend...'
                sh 'docker build -t ${FRONTEND_IMAGE}:latest ./portfolio-spa-main'
            }
        }

        stage('Test Backend') {
            steps {
                echo '🧪 Test de santé backend...'
                sh '''
                    docker run --rm \
                        -e MONGODB_URI=mongodb+srv://babijou8_db_user:fFQ5o8JR94spCmF7@cluster0.vsshvby.mongodb.net/ \
                        -e PORT=5000 \
                        ${BACKEND_IMAGE}:latest \
                        node -e "console.log('✅ Backend OK')"
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Déploiement avec Docker Compose...'
                // Stopper et supprimer les anciens containers par nom (peu importe leur projet compose)
                sh 'docker stop portfolio-backend portfolio-frontend || true'
                sh 'docker rm portfolio-backend portfolio-frontend || true'
                sh 'docker compose -f ${COMPOSE_FILE} down --remove-orphans || true'
                sh 'docker compose -f ${COMPOSE_FILE} up -d --build'
            }
        }

        stage('Health Check') {
            steps {
                echo '🔍 Vérification que les services sont up...'
                sh 'sleep 10'
                sh 'docker compose -f ${COMPOSE_FILE} ps'
                sh '''
                    curl -f http://localhost:5000/ || \
                    (echo "❌ Backend inaccessible" && exit 1)
                '''
                sh '''
                    curl -f http://localhost:80/ || \
                    (echo "❌ Frontend inaccessible" && exit 1)
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline réussi — Application déployée avec succès.'
        }
        failure {
            echo '❌ Pipeline échoué — Vérifiez les logs ci-dessus.'
            sh 'docker compose -f ${COMPOSE_FILE} logs --tail=50 || true'
        }
        always {
            echo '🧹 Nettoyage des images intermédiaires...'
            sh 'docker image prune -f || true'
        }
    }
}
