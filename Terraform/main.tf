resource "azurerm_resource_group" "name" {
  name     = var.resource_group
  location = var.location
}

module "Storage-account" {
  source               = "./modules/Storage-account"
  resource_group       = var.resource_group
  location             = var.location
  storage_account_name = var.storage_account_name
  index_file           = var.index_file
  file_content_types   = var.file_content_types
  # files                = var.files
  
  depends_on = [azurerm_resource_group.name]
}

# module "CDN" {
#   source            = "./modules/CDN"
#   resource_group    = var.resource_group
#   location          = var.location
#   cdn_name          = var.cdn_name
#   cdn_endpoint_name = var.cdn_endpoint_name
#   origin_name       = var.origin_name
#   host_name         = module.Storage-account.static_website_hostname

#   depends_on = [azurerm_resource_group.name, module.Storage-account]
# }

module "Cosmos-db" {
  source          = "./modules/Cosmos-db"
  resource_group  = var.resource_group
  location        = var.location
  db_account_name = var.db_account_name
  db_table_name   = var.db_table_name


  depends_on = [azurerm_resource_group.name]
}

# module "Key-vault" {
#   source             = "./modules/Key-vault"
#   resource_group     = var.resource_group
#   location           = var.location
#   key_vault_name     = var.key_vault_name
#   cosmos_comm_value  = module.Cosmos-db.cosmosdb_connection_string
#   function_object_id = module.Function.function_object_id

#   depends_on = [azurerm_resource_group.name]
# }

module "Function" {
  source                = "./modules/Function"
  resource_group        = var.resource_group
  location              = var.location
  service_plan_name     = var.service_plan_name
  function_app_name     = var.function_app_name
  function_storage_name = var.function_storage_name
  cosmos_conn_id        = module.Cosmos-db.cosmosdb_connection_string
  table_name = module.Cosmos-db.table_name

  depends_on = [azurerm_resource_group.name]

}
# resource "azurerm_key_vault_access_policy" "functionapp" {
#   object_id    = module.Function.function_object_id
#   key_vault_id = module.Key-vault.Key_vault_id
#   tenant_id    = module.Function.tenant_id

#   depends_on = [azurerm_resource_group.name]
# }