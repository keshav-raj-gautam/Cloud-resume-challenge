output "cosmosdb_connection_string" {
  value = azurerm_key_vault_secret.cosmos_conn.id
}

output "Key_vault_id" {
  value = azurerm_key_vault.key_vault.id
}