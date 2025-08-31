resource "azurerm_key_vault" "key_vault" {
  name = var.key_vault_name
  resource_group_name = var.resource_group
  location = var.location
  tenant_id = data.azurerm_client_config.current.tenant_id
  sku_name = "standard"
}

data "azurerm_client_config" "current" {}

resource "azurerm_key_vault_access_policy" "terraform" {
  object_id = data.azurerm_client_config.current.object_id
  key_vault_id = azurerm_key_vault.key_vault.id
  tenant_id = data.azurerm_client_config.current.tenant_id

  secret_permissions = ["Get", "List", "Set", "Delete"]
}

# resource "azurerm_key_vault_access_policy" "functionapp" {
#   object_id = var.function_object_id
#   key_vault_id = azurerm_key_vault.key_vault.id
#   tenant_id = data.azurerm_client_config.current.tenant_id
# }

