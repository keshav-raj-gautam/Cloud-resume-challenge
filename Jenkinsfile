pipeline {
    agent any

    environment {
        ARM_CLIENT_ID       = credentials('ARM_CLIENT_ID')
        ARM_CLIENT_SECRET   = credentials('ARM_CLIENT_SECRET')
        ARM_SUBSCRIPTION_ID = credentials('ARM_SUBSCRIPTION_ID')
        ARM_TENANT_ID       = credentials('ARM_TENANT_ID')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/keshav-raj-gautam/Cloud-resume-challenge.git'
            }
        }

        stage('Terraform Init & Apply') {
            steps {
                dir("Terraform") {
                    withCredentials([string(credentialsId: 'TERRAFORM_CLOUD_TOKEN', variable: 'TF_CLOUD_TOKEN')]) {
                        sh """
                            echo "Initializing Terraform Cloud with token..."
                            cat > $WORKSPACE/.terraformrc <<EOF
credentials "app.terraform.io" {
  token = "$TF_CLOUD_TOKEN"
}
EOF
                            export TF_CLI_CONFIG_FILE=$WORKSPACE/.terraformrc
                            terraform init
                            terraform apply --auto-approve
                        """
                    }
                }
            }
        }

        stage('Azure Login') {
            steps {
                sh """
            az login --service-principal \
              -u \$ARM_CLIENT_ID \
              -p \$ARM_CLIENT_SECRET \
              --tenant \$ARM_TENANT_ID
            az account set --subscription \$ARM_SUBSCRIPTION_ID
            az account show
        """
            }
        }

        stage('Add HTTP Trigger Function') {
            steps {
                dir("function") {
                    script {
                        def funcName = 'resume-count'

                        
                        sh """
                            [ -d ${funcName} ] || func init . --javascript
                        """

                        
                        sh """
                            [ -d ${funcName} ] || func new --name ${funcName} --template "HTTP trigger" --authlevel "anonymous"
                        """

                        
                        sh """
                            func azure functionapp publish resume-count --javascript
                        """
                    }
                }
            }
        }

        stage('Get Function URL') {
            steps {
                script {
                    env.FUNCTION_URL = sh(
                        script: """
                            az functionapp function show \
                                --resource-group Cloud-resume \
                                --name resume-count \
                                --function-name resume-count \
                                --query "invokeUrlTemplate" -o tsv
                        """,
                        returnStdout: true
                    ).trim()
                    echo "Function URL: ${env.FUNCTION_URL}"
                }
            }
        }

        stage('Update Frontend Code') {
            steps {
                dir("www") {
                    sh """
                        sed -i "s|<FUNCTION_URL>|${FUNCTION_URL}|g" app.js
                    """
                }
            }
        }

        stage('Deploy Frontend to Azure Storage') {
    steps {
        dir("www") {
            sh """
                echo "=== Azure Login ==="
                az login --service-principal \
                  -u $ARM_CLIENT_ID \
                  -p $ARM_CLIENT_SECRET \
                  --tenant $ARM_TENANT_ID

                az account set --subscription $ARM_SUBSCRIPTION_ID
                az account show

                


                echo "=== Uploading frontend files to Azure Storage ==="
                az storage blob upload-batch \
                    --account-name resume2450 \
                    --auth-mode login \
                    -s . -d '\$web' --overwrite
            """
        }
    }
}

        stage('Notify') {
    steps {
        script {
            def siteUrl = sh(
                script: '''
                    az storage account show \
                      --name resume2450 \
                      --resource-group Cloud-resume \
                      --query "primaryEndpoints.web" -o tsv
                ''',
                returnStdout: true
            ).trim()

            emailext(
                subject: "Pipeline Success - Cloud Resume Project",
                body: """<p>Hello,</p>
                         <p>Your pipeline <b>succeeded</b> 🎉</p>
                         <p>Static Website URL: <a href="${siteUrl}">${siteUrl}</a></p>
                         <br>
                         <p>Regards,<br>Jenkins</p>""",
                to: "dilagautam@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}


    }
}
