output "cosmosdb_connection_string" {
  value = "DefaultEndpointsProtocol=https;AccountName=${azurerm_cosmosdb_account.db-account.name};AccountKey=${azurerm_cosmosdb_account.db-account.primary_key};TableEndpoint=${azurerm_cosmosdb_account.db-account.endpoint};"
  
}
