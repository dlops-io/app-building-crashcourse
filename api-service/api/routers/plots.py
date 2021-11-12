import pandas as pd
from fastapi import APIRouter


# Define Router
router = APIRouter()

data_url = "https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv"
data = None


@router.get("/get_data")
async def get_data():
    global data

    if data is None:
        data = pd.read_csv(data_url)

    return data.to_dict('records')
