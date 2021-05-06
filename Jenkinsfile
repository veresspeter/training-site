pipeline {
  agent none
  stages {
    stage('Frontend Build') {
      agent {
        docker 'node:12-alpine'
      }
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

    stage('Backend Build') {
      agent {
        docker 'openjdk:11'
      }
      environment {
          DOCKERHUB = credentials('dockerhubId')
      }
      steps {
        sh 'chmod go-w+x -R .'
        sh './mvnw package -Pprod -Djib.to.auth.password=$DOCKERHUB_PSW -Djib.to.auth.username=$DOCKERHUB_USR -DbuildNo=$BUILD_NUMBER verify jib:build'
      }
    }

    stage('Deploy') {
        agent any
        steps {
            withCredentials([sshUserPrivateKey(credentialsId: 'aws-frankfurt-default-kp', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USR')]) {
                catchError {
                    sh 'ssh -i /home/ubuntu/jenkins/kp.pem ${SSH_USR}@maxmove.hu docker stop trainingsite'
                }
                catchError {
                    sh 'ssh -i /home/ubuntu/jenkins/kp.pem ${SSH_USR}@maxmove.hu docker rmi veresspeter/trainingsite'
                }
                sh 'ssh -i /home/ubuntu/jenkins/kp.pem ${SSH_USR}@maxmove.hu docker pull veresspeter/trainingsite'
                sh 'ssh -i /home/ubuntu/jenkins/kp.pem ${SSH_USR}@maxmove.hu docker run -d --rm --name trainingsite --network host veresspeter/trainingsite'
            }
        }
    }

  }
}
