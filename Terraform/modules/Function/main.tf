resource "azurerm_storage_account" "function_storage" {
  name = var.function_storage_name
  resource_group_name = var.resource_group
  location =var.location
  account_replication_type = "LRS"
  account_tier = "Standard"
  network_rules {
    default_action = "Allow"
    bypass         = ["AzureServices"]
  }

  
}

resource "azurerm_service_plan" "service_plan" {
  name = var.service_plan_name
  resource_group_name = var.resource_group
  location = var.location
  os_type = "Linux"
  sku_name = "Y1"

  
}



resource "azurerm_linux_function_app" "function" {
  name = var.function_app_name
  resource_group_name = var.resource_group
  location = var.location
  service_plan_id = azurerm_service_plan.service_plan.id
  storage_account_name = azurerm_storage_account.function_storage.name

  site_config {
    application_stack {
      python_version = "3.10"
    }
  }

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "FUNCTIONS_EXTENSION_VERSION" = "~4"
    "CosmosDBConnectionString"    = "@Microsoft.KeyVault(SecretUri=${var.cosmos_conn_id})"
    "AzureWebJobsStorage"         = azurerm_storage_account.function_storage.primary_connection_string
    "WEBSITE_CONTENTSHARE"        = lower(var.function_app_name)
  }


}

resource "azurerm_role_assignment" "storage_file_data_contributor" {
  scope                = azurerm_storage_account.function_storage.id
  role_definition_name = "Storage File Data Contributor"
  principal_id         = azurerm_linux_function_app.function.identity[0].principal_id
}

