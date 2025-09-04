output "cosmosdb_connection_string" {
  value = "DefaultEndpointsProtocol=https;AccountName=${azurerm_cosmosdb_account.db-account.name};AccountKey=${azurerm_cosmosdb_account.db-account.primary_key};TableEndpoint=https://${azurerm_cosmosdb_account.db-account.name}.table.cosmos.azure.com:443/;"
  sensitive = true
}

output "table_name" {
  value = azurerm_cosmosdb_table.db-table.name
}
