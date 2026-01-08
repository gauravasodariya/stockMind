let reports = [];

export const generateReport = (req, res) => {
  try {
    const { title, sections, products } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Report title is required" });
    }

    const report = {
      id: Date.now(),
      title,
      sections: sections || {},
      products: products || [],
      generatedAt: new Date(),
      status: "completed",
    };

    reports.push(report);

    res.status(201).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportById = (req, res) => {
  const report = reports.find((r) => r.id === parseInt(req.params.id));

  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  res.json(report);
};

export const listReports = (req, res) => {
  const { limit = 10, offset = 0 } = req.query;

  const paginated = reports.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit)
  );

  res.json({
    reports: paginated,
    total: reports.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
};
