from fastapi import APIRouter

from backend.routes import alerts, counterfeit, fraud_graph, geo, reports, scam_detection


api_router = APIRouter()
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(counterfeit.router, prefix="/counterfeit", tags=["counterfeit"])
api_router.include_router(fraud_graph.router, prefix="/fraud-graph", tags=["fraud-graph"])
api_router.include_router(geo.router, prefix="/geo", tags=["geo"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(scam_detection.router, prefix="/scam-detection", tags=["scam-detection"])
