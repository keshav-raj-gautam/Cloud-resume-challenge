variable "resource_group" {}
variable "location" {}
variable "storage_account_name" {}

# variable "files" {
#   type = map(string)
# }


 variable "index_file" {}
 variable "file_content_types" {
  type = map(string)
}
# variable "index_source" {}
# variable "css_file" {}
# variable "css_source" {}
# variable "js_file" {}
# variable "js_source" {}