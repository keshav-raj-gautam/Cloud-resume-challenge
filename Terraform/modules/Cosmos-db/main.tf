resource "azurerm_cosmosdb_account" "db-account" {
  name = var.db_account_name
  location = var.location
  resource_group_name = var.resource_group
  offer_type = "Standard"
  geo_location {
    location          = var.location
    failover_priority = 0
  }
  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 100
  }

   capabilities {
    name = "EnableTable"
  }

}

resource "azurerm_cosmosdb_table" "db-table" {
  name = var.db_table_name
  resource_group_name = var.resource_group
  account_name = azurerm_cosmosdb_account.db-account.name
}