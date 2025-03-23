from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
import json
from pathlib import Path
from typing import List, Dict, Any
import pandas as pd

def create_html_report(title: str, description: str, statistics: List[Dict[str, Any]]) -> str:
    """
    Crear el HTML para el reporte usando Jinja2
    """
    env = Environment(loader=FileSystemLoader("app/templates"))
    template = env.get_template("report_template.html")
    
    # Procesar los datos para la visualización
    processed_stats = []
    for stat in statistics:
        df = pd.DataFrame(stat["data"])
        table_html = df.to_html(classes=["table", "table-striped"], index=False)
        
        processed_stats.append({
            "title": stat["title"],
            "description": stat["description"],
            "table": table_html,
            "metadata": stat["metadata"]
        })
    
    return template.render(
        title=title,
        description=description,
        statistics=processed_stats,
        creation_date=pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
    )

def generate_pdf(html_content: str, output_path: str) -> None:
    """
    Generar PDF a partir del HTML usando WeasyPrint
    """
    HTML(string=html_content).write_pdf(output_path) 