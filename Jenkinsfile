pipeline {
    agent any

    environment {
        COMPOSE_FILE   = 'docker-compose.deploy.yml'
        BACKEND_IMAGE  = 'portfolio-backend'
        FRONTEND_IMAGE = 'portfolio-frontend'
        SONAR_URL      = 'http://sonarqube:9000'
        DOCKERHUB_USER = 'fatoutogo'
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
                sh 'docker tag ${BACKEND_IMAGE}:latest ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest'
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🔨 Build image Docker frontend...'
                sh 'docker build -t ${FRONTEND_IMAGE}:latest ./portfolio-spa-main'
                sh 'docker tag ${FRONTEND_IMAGE}:latest ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest'
            }
        }

        stage('Test Backend') {
            steps {
                echo '🧪 Test de santé backend...'
                sh '''
                    docker run --rm \
                        -e MONGODB_URI=mongodb+srv://babijou8_db_user:D9iwsRZ5tckatyEo@mongodb.aio8c4i.mongodb.net/?appName=mongodb \
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

        stage('Push to Docker Hub') {
            steps {
                echo '📤 Push images sur Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest'
                    sh 'docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '☸️ Déploiement sur Kubernetes...'
                sh 'kubectl apply -f k8s/secrets.yml'
                sh 'kubectl apply -f k8s/backend-deployment.yml'
                sh 'kubectl apply -f k8s/backend-service.yml'
                sh 'kubectl apply -f k8s/backend-nodeport.yml'
                sh 'kubectl apply -f k8s/frontend-deployment.yml'
                sh 'kubectl apply -f k8s/frontend-service.yml'
                sh 'kubectl rollout restart deployment/portfolio-backend'
                sh 'kubectl rollout restart deployment/portfolio-frontend'
                sh 'kubectl rollout status deployment/portfolio-backend --timeout=120s'
                sh 'kubectl rollout status deployment/portfolio-frontend --timeout=120s'
            }
        }
            steps {
                echo '🚦 Vérification Quality Gate SonarQube...'
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        JENKINS_NETWORK=$(docker inspect jenkins --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}')
                        sleep 15

                        # Vérifier Quality Gate Backend
                        BACKEND_STATUS=$(docker run --rm \
                            --network $JENKINS_NETWORK \
                            curlimages/curl:latest \
                            -s -u "${SONAR_TOKEN}:" \
                            "http://sonarqube:9000/api/qualitygates/project_status?projectKey=portfolio-backend" \
                            | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
                        echo "Backend Quality Gate : $BACKEND_STATUS"

                        # Vérifier Quality Gate Frontend
                        FRONTEND_STATUS=$(docker run --rm \
                            --network $JENKINS_NETWORK \
                            curlimages/curl:latest \
                            -s -u "${SONAR_TOKEN}:" \
                            "http://sonarqube:9000/api/qualitygates/project_status?projectKey=portfolio-frontend" \
                            | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
                        echo "Frontend Quality Gate : $FRONTEND_STATUS"

                        if [ "$BACKEND_STATUS" = "ERROR" ] || [ "$FRONTEND_STATUS" = "ERROR" ]; then
                            echo "❌ Quality Gate échouée"
                            exit 1
                        fi
                        echo "✅ Quality Gate OK"
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
            mail to: 'babijou8@gmail.com',
                 subject: "✅ Jenkins Build #${BUILD_NUMBER} — SUCCESS",
                 body: """
Le pipeline jenkins-pip #${BUILD_NUMBER} a réussi.

Projet  : ${JOB_NAME}
Build   : #${BUILD_NUMBER}
Statut  : SUCCESS ✅
Durée   : ${currentBuild.durationString}

Voir les détails : ${BUILD_URL}
                 """
        }
        failure {
            echo '❌ Pipeline échoué — Vérifiez les logs ci-dessus.'
            sh 'docker compose -f ${COMPOSE_FILE} logs --tail=50 || true'
            mail to: 'babijou8@gmail.com',
                 subject: "❌ Jenkins Build #${BUILD_NUMBER} — FAILURE",
                 body: """
Le pipeline jenkins-pip #${BUILD_NUMBER} a échoué.

Projet  : ${JOB_NAME}
Build   : #${BUILD_NUMBER}
Statut  : FAILURE ❌
Durée   : ${currentBuild.durationString}

Consulter les logs : ${BUILD_URL}console
                 """
        }
        always {
            echo '🧹 Nettoyage des images intermédiaires...'
            sh 'docker image prune -f || true'
        }
    }
}
