let reports = [];

export const generateReport = (req, res) => {
  try {
    const { type, startDate, endDate, title, sections, products } = req.body;

    // Handle both old and new format
    const reportTitle =
      title ||
      `${
        type ? type.charAt(0).toUpperCase() + type.slice(1) : "General"
      } Report - ${new Date().toLocaleDateString()}`;

    const report = {
      id: Date.now(),
      name: reportTitle,
      title: reportTitle,
      type: type ? type.charAt(0).toUpperCase() + type.slice(1) : "General",
      created: new Date().toISOString().split("T")[0],
      period: startDate && endDate ? `${startDate} to ${endDate}` : "N/A",
      startDate: startDate || null,
      endDate: endDate || null,
      sections: sections || {},
      products: products || [],
      generatedAt: new Date(),
      status: "Ready",
    };

    reports.push(report);

    res.status(201).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Report generation error:", error);
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
