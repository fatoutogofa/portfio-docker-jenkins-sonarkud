pipeline {
    agent any

    environment {
        COMPOSE_FILE   = 'docker-compose.deploy.yml'
        BACKEND_IMAGE  = 'portfolio-backend'
        FRONTEND_IMAGE = 'portfolio-frontend'
        SONAR_URL      = 'http://sonarqube:9000'
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

        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Analyse SonarQube...'
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        JENKINS_NETWORK=$(docker inspect jenkins --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}')
                        echo "Réseau Jenkins détecté : $JENKINS_NETWORK"

                        # Analyse Backend
                        docker run --rm \
                            --network $JENKINS_NETWORK \
                            --user root \
                            -v $(pwd)/DOCKER-main:/usr/src \
                            sonarsource/sonar-scanner-cli:latest \
                            -Dsonar.projectKey=portfolio-backend \
                            -Dsonar.projectName="Portfolio Backend" \
                            -Dsonar.sources=/usr/src \
                            -Dsonar.inclusions="**/*.js" \
                            -Dsonar.exclusions="**/node_modules/**,**/.git/**" \
                            -Dsonar.language=js \
                            -Dsonar.host.url=http://sonarqube:9000 \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.scanner.socketTimeout=120

                        echo "⏳ Attente 30s entre les deux analyses..."
                        sleep 30

                        # Analyse Frontend
                        docker run --rm \
                            --network $JENKINS_NETWORK \
                            --user root \
                            -v $(pwd)/portfolio-spa-main:/usr/src \
                            sonarsource/sonar-scanner-cli:latest \
                            -Dsonar.projectKey=portfolio-frontend \
                            -Dsonar.projectName="Portfolio Frontend" \
                            -Dsonar.sources=/usr/src \
                            -Dsonar.inclusions="**/*.js,**/*.jsx" \
                            -Dsonar.exclusions="**/node_modules/**,**/dist/**,**/.git/**" \
                            -Dsonar.language=js \
                            -Dsonar.host.url=http://sonarqube:9000 \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.scanner.socketTimeout=120
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Déploiement avec Docker Compose...'
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
                    docker exec portfolio-backend \
                        node -e "require('http').get('http://localhost:5000/', r => { console.log('✅ Backend HTTP', r.statusCode); process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', e => { console.error('❌', e.message); process.exit(1); })"
                '''
                sh '''
                    docker exec portfolio-frontend \
                        curl -sf http://127.0.0.1:80/ > /dev/null && echo "✅ Frontend OK" || (echo "❌ Frontend inaccessible" && exit 1)
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
