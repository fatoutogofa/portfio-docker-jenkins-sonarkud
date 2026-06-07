pipeline {
    agent any
 
    environment {
        BACKEND_IMAGE  = 'portfolio-backend'
        FRONTEND_IMAGE = 'portfolio-frontend'
        DOCKERHUB_USER = 'fatoutogo'
        SONAR_URL      = 'http://sonarqube:9000'
        K8S_DIR        = 'k8s'
    }
 
    stages {
 
        // ─────────────────────────────────────────
        // 1. CHECKOUT
        // ─────────────────────────────────────────
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
 
        // ─────────────────────────────────────────
        // 2. BUILD IMAGES DOCKER
        // ─────────────────────────────────────────
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
 
        // ─────────────────────────────────────────
        // 3. TEST BACKEND
        // ─────────────────────────────────────────
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
 
        // ─────────────────────────────────────────
        // 4. ANALYSE SONARQUBE
        // ─────────────────────────────────────────
        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Analyse SonarQube...'
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        JENKINS_NETWORK=$(docker inspect jenkins --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}')
                        echo "Réseau Jenkins : $JENKINS_NETWORK"
 
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
 
                        echo "⏳ Pause 30s entre les analyses..."
                        sleep 30
 
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
 
        // ─────────────────────────────────────────
        // 5. QUALITY GATE SONARQUBE
        // ─────────────────────────────────────────
        stage('Quality Gate') {
            steps {
                echo '🚦 Vérification Quality Gate SonarQube...'
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        JENKINS_NETWORK=$(docker inspect jenkins --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}')
                        sleep 15
 
                        BACKEND_STATUS=$(docker run --rm \
                            --network $JENKINS_NETWORK \
                            curlimages/curl:latest \
                            -s -u "${SONAR_TOKEN}:" \
                            "http://sonarqube:9000/api/qualitygates/project_status?projectKey=portfolio-backend" \
                            | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
                        echo "Backend Quality Gate : $BACKEND_STATUS"
 
                        FRONTEND_STATUS=$(docker run --rm \
                            --network $JENKINS_NETWORK \
                            curlimages/curl:latest \
                            -s -u "${SONAR_TOKEN}:" \
                            "http://sonarqube:9000/api/qualitygates/project_status?projectKey=portfolio-frontend" \
                            | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
                        echo "Frontend Quality Gate : $FRONTEND_STATUS"
 
                        if [ "$BACKEND_STATUS" = "ERROR" ] || [ "$FRONTEND_STATUS" = "ERROR" ]; then
                            echo "❌ Quality Gate échouée — pipeline stoppé"
                            exit 1
                        fi
                        echo "✅ Quality Gate OK"
                    '''
                }
            }
        }
 
        // ─────────────────────────────────────────
        // 6. PUSH DOCKER HUB
        // ─────────────────────────────────────────
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
 
        // ─────────────────────────────────────────
        // 7. DEPLOY SUR KUBERNETES
        // ─────────────────────────────────────────
        stage('Deploy to Kubernetes') {
            steps {
                echo '☸️ Déploiement sur Kubernetes...'
                sh 'kubectl apply -f ${K8S_DIR}/configmap.yml'
                sh 'kubectl apply -f ${K8S_DIR}/secrets.yml'
                sh 'kubectl apply -f ${K8S_DIR}/backend-deployment.yml'
                sh 'kubectl apply -f ${K8S_DIR}/backend-service.yml'
                sh 'kubectl apply -f ${K8S_DIR}/backend-nodeport.yml'
                sh 'kubectl apply -f ${K8S_DIR}/frontend-deployment.yml'
                sh 'kubectl apply -f ${K8S_DIR}/frontend-service.yml'
                sh 'kubectl apply -f ${K8S_DIR}/ingress.yml'
                echo '🔄 Redémarrage des déploiements pour charger les nouvelles images...'
                sh 'kubectl rollout restart deployment/portfolio-backend'
                sh 'kubectl rollout restart deployment/portfolio-frontend'
            }
        }
 
        // ─────────────────────────────────────────
        // 8. HEALTH CHECK KUBERNETES
        // ─────────────────────────────────────────
        stage('Health Check') {
            steps {
                echo '🔍 Vérification du déploiement Kubernetes...'
                sh 'kubectl rollout status deployment/portfolio-backend --timeout=180s'
                sh 'kubectl rollout status deployment/portfolio-frontend --timeout=180s'
                echo '📋 État des pods :'
                sh 'kubectl get pods'
                echo '🌐 État des services :'
                sh 'kubectl get svc'
                echo '🚪 État de l ingress :'
                sh 'kubectl get ingress'
            }
        }
    }
 
    // ─────────────────────────────────────────
    // POST — Notifications email
    // ─────────────────────────────────────────
    post {
        success {
            echo '✅ Pipeline réussi — Application déployée sur Kubernetes.'
            mail to: 'babijou8@gmail.com',
                 subject: "✅ Jenkins Build #${BUILD_NUMBER} — SUCCESS",
                 body: """
Le pipeline #${BUILD_NUMBER} a réussi.
 
Projet  : ${JOB_NAME}
Build   : #${BUILD_NUMBER}
Statut  : SUCCESS ✅
Durée   : ${currentBuild.durationString}
 
Pods actifs : kubectl get pods
Ingress     : http://portfolio.local
 
Voir les détails : ${BUILD_URL}
                 """
        }
        failure {
            echo '❌ Pipeline échoué — Vérifiez les logs.'
            mail to: 'babijou8@gmail.com',
                 subject: "❌ Jenkins Build #${BUILD_NUMBER} — FAILURE",
                 body: """
Le pipeline #${BUILD_NUMBER} a échoué.
 
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
 