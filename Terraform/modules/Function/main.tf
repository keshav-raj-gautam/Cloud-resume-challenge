resource "azurerm_storage_account" "function_storage" {
  name = var.function_storage_name
  resource_group_name = var.resource_group
  location =var.location
  account_replication_type = "LRS"
  account_tier = "Standard"
 
  is_hns_enabled = false
  network_rules {
  default_action = "Allow"
}
  

  
}

resource "azurerm_service_plan" "service_plan" {
  name = var.service_plan_name
  resource_group_name = var.resource_group
  location = var.location
  os_type = "Linux"
  sku_name = "Y1"
  depends_on = [ azurerm_storage_account.function_storage ]

  
}



resource "azurerm_linux_function_app" "function" {
  name = var.function_app_name
  resource_group_name = var.resource_group
  location = var.location
  service_plan_id = azurerm_service_plan.service_plan.id
  storage_account_access_key = azurerm_storage_account.function_storage.primary_access_key
  storage_account_name = azurerm_storage_account.function_storage.name

  site_config {
    application_stack {
      node_version = "20"

    }
    cors {
    allowed_origins = ["*"]
  }
  }

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME" = "node"
    "FUNCTIONS_EXTENSION_VERSION" = "~4"
    "COSMOS_CONNECTION_STRING"    = var.cosmos_conn_id
    "AzureWebJobsStorage"         = azurerm_storage_account.function_storage.primary_connection_string
    "WEBSITE_CONTENTSHARE"        = lower(var.function_app_name)
    "TABLE_NAME"= var.table_name
  }
  depends_on = [
    azurerm_service_plan.service_plan,
    azurerm_storage_account.function_storage
  ]


}

# resource "azurerm_role_assignment" "storage_file_data_contributor" {
#   scope                = azurerm_storage_account.function_storage.id
#   role_definition_name = "Storage File Data Contributor"
#   principal_id         = azurerm_linux_function_app.function.identity[0].principal_id

#   depends_on          = [
#     azurerm_linux_function_app.function,
#     azurerm_storage_account.function_storage
#   ]
# }

