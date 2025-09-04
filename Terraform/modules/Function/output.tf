output "function_object_id" {
  value = azurerm_linux_function_app.function.identity[0].principal_id
}

# output "function_object_id" {
#   value = azurerm_windows_function_app.win-function.identity[0].principal_id
# }

data "azurerm_client_config" "current" {}
output "tenant_id" {
  value = data.azurerm_client_config.current.tenant_id
}