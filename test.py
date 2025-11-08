# bird_dashboard.py

import dash
from dash import dcc, html
import dash_table
import pandas as pd


# Sample bird data
data = {
    "Name": ["Robin", "Blue Jay", "Sparrow", "Eagle", "Penguin"],
    "Species": ["Turdus migratorius", "Cyanocitta cristata", "Passer domesticus", "Aquila chrysaetos", "Aptenodytes forsteri"],
    "Habitat": ["Forests, Gardens", "Forests, Urban areas", "Urban, Rural", "Mountains, Forests", "Antarctic"],
    "Diet": ["Insects, Berries", "Nuts, Insects", "Seeds, Insects", "Small mammals, Fish", "Fish, Krill"],
    "Status": ["Least Concern", "Least Concern", "Least Concern", "Least Concern", "Near Threatened"]
}

df = pd.DataFrame(data)

# Initialize the app
app = dash.Dash(__name__)

# Layout
app.layout = html.Div([
    html.H1("Bird Information Dashboard", style={'textAlign': 'center'}),
    dash_table.DataTable(
        id='bird-table',
        columns=[{"name": i, "id": i} for i in df.columns],
        data=df.to_dict('records'),
        filter_action="native",
        sort_action="native",
        page_size=10,
        style_table={'overflowX': 'auto'},
        style_cell={'textAlign': 'left', 'padding': '5px'}
    ),
    html.Br(),
    html.Div([
        html.Label("Select a bird to see details:"),
        dcc.Dropdown(
            id='bird-dropdown',
            options=[{'label': name, 'value': name} for name in df['Name']],
            value='Robin'
        ),
        html.Div(id='bird-details', style={'marginTop': '20px'})
    ])
])

# Callback to show bird details
@app.callback(
    dash.dependencies.Output('bird-details', 'children'),
    dash.dependencies.Input('bird-dropdown', 'value')
)
def update_bird_details(selected_bird):
    bird = df[df['Name'] == selected_bird].iloc[0]
    return html.Ul([
        html.Li(f"Species: {bird['Species']}"),
        html.Li(f"Habitat: {bird['Habitat']}"),
        html.Li(f"Diet: {bird['Diet']}"),
        html.Li(f"Conservation Status: {bird['Status']}")
    ])

# Run the app
#if __name__ == '__main__':
#    app.run(debug=True)
