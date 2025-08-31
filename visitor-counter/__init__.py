import os
import logging
import azure.functions as func
from azure.data.tables import TableServiceClient, UpdateMode

# Table API connection string
COSMOS_TABLE_CONN_STR = os.environ['COSMOS_TABLE_CONN_STR']
TABLE_NAME = 'VisitorCount'

# Initialize Table client
service = TableServiceClient.from_connection_string(conn_str=COSMOS_TABLE_CONN_STR)
table_client = service.get_table_client(table_name=TABLE_NAME)

# Create table if not exists
try:
    table_client.create_table()
except:
    pass

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Visitor counter function processed a request.")

    # Partition & Row key
    partition_key = "visitor"
    row_key = "count"

    try:
        entity = table_client.get_entity(partition_key=partition_key, row_key=row_key)
        entity['Count'] += 1
        table_client.update_entity(entity=entity, mode=UpdateMode.REPLACE)
        count = entity['Count']
    except:
        # First visitor
        table_client.create_entity({'PartitionKey': partition_key, 'RowKey': row_key, 'Count': 1})
        count = 1

    return func.HttpResponse(f"Visitor count: {count}")
