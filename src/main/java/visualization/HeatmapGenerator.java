package visualization;

public class HeatmapGenerator {

    public String getHeatLevel(double stress) {

        if(stress > 80) {
            return "RED";
        }

        if(stress > 40) {
            return "ORANGE";
        }

        return "BLUE";
    }
}
