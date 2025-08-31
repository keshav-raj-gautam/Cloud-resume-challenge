terraform {


  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.42.0"
    }
  }
}

terraform {
  cloud {

    organization = "Project-terraform0503"

    workspaces {
      name = "cloud-resume-workspace"
    }
  }
}

provider "azurerm" {
  features {}

}