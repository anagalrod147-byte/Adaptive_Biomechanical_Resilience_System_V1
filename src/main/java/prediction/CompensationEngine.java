package prediction;

public class CompensationEngine {

    public String evaluateRegionRisk(
            double stress
    ) {

        if(stress > 80) {
            return "HIGH RISK";
        }

        if(stress > 40) {
            return "MODERATE RISK";
        }

        return "STABLE";
    }
}