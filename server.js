const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const FILE_PATH = './cashow0_config_GfxSchemaTemplates.json';

app.get('/api/designs', (req, res) => {
  const raw = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  const allDesigns = [];

  raw.forEach(schema => {
    const designs = JSON.parse(schema.CasparCgDesignValues);
    designs.forEach(d => {
      allDesigns.push({
        schema: schema.GfxSchemaTemplatesName,
        name: d.name,
        backgroundLoop: d.backgroundLoop,
        ...d.properties
      });
    });
  });

  res.json(allDesigns);
});

app.post('/api/save', (req, res) => {
  const updatedDesigns = req.body;

  const grouped = {};
  updatedDesigns.forEach(d => {
    if (!grouped[d.schema]) grouped[d.schema] = [];
    const { schema, name, backgroundLoop, ...props } = d;
    grouped[schema].push({
      name,
      backgroundLoop,
      properties: props
    });
  });

  const final = Object.entries(grouped).map(([schema, designs]) => ({
    GfxSchemaTemplatesName: schema,
    CasparCgDesignValues: JSON.stringify(designs, null, 2)
  }));

  fs.writeFileSync(FILE_PATH, JSON.stringify(final, null, 2), 'utf8');
  res.json({ status: 'success' });
});

app.listen(PORT, () => {
  console.log(`Server kører på http://localhost:${PORT}`);
});
