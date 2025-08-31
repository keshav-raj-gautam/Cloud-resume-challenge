resource "azurerm_cdn_profile" "cdn_profile" {
  name = var.cdn_name
  resource_group_name = var.resource_group
  location = var.location
  sku = "Standard_Akamai"

}

resource "azurerm_cdn_endpoint" "cdn_endpoint" {
  name = var.cdn_endpoint_name
  location = var.location
  resource_group_name = var.resource_group
  profile_name = azurerm_cdn_profile.cdn_profile.name
  origin {
    name = var.origin_name
    host_name = var.host_name
    }
}