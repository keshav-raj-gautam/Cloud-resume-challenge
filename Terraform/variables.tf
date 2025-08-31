variable "resource_group" {}
variable "location" {}

#Storage Variables
variable "storage_account_name" {}
variable "index_file" {}
variable "file_content_types" {
  type = map(string)
  default = {
    "index.html" = "text/html"
    "style.css"  = "text/css"
    "app.js"     = "application/javascript"
  }
}
variable "files" {
  type = map(string)

  default = {
    "index.html" = "./www/index.html"
    "style.css"  = "./www/style.css"
    "app.js"     = "./www/app.js"
  }
}

# #CDN Variables

# variable "cdn_name" {}
# variable "cdn_endpoint_name" {}
# variable "origin_name" {}
# # variable "host_name" {}

#CosmosDB variables

variable "db_account_name" {}
variable "db_table_name" {}

#Key Vault

variable "key_vault_name" {}

#Function
variable "function_storage_name" {}
variable "service_plan_name" {}
variable "function_app_name" {}