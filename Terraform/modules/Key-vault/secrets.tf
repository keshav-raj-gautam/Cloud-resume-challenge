resource "azurerm_key_vault_secret" "cosmos_conn" {
  name = "CosmosDBConnectionString"
  key_vault_id = azurerm_key_vault.key_vault.id
  value = var.cosmos_comm_value
}