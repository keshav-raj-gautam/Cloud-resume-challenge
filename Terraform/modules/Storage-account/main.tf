resource "azurerm_storage_account" "storage_account" {
  name = var.storage_account_name
  resource_group_name = var.resource_group
  location = var.location
  account_replication_type = "LRS"
  account_tier = "Standard"
  
}

resource "azurerm_storage_account_static_website" "name" {
  storage_account_id = azurerm_storage_account.storage_account.id
  index_document     = var.index_file

}

resource "azurerm_storage_container" "container" {
  name = "$web"
  storage_account_id = azurerm_storage_account.storage_account.id
  container_access_type = "blob"

}

resource "azurerm_storage_blob" "index" {
  for_each = var.files
  name = each.key
  type = "Block"
  storage_container_name = azurerm_storage_container.container.name
  storage_account_name = azurerm_storage_account.storage_account.name
  source = each.value
content_type = lookup(var.file_content_types, each.key, "application/octet-stream")
}