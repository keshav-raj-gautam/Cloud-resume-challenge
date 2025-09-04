output "static_website_url" {
  value = module.Storage-account.static_website_url
}

# output "cdn_endpoint" {
#   value = module.CDN.cdn_endpoint
# }

output "cosmosdb_connection_string" {
  value = module.Cosmos-db.cosmosdb_connection_string
  sensitive = true
}