package flow.bgu.ac.il;

import com.google.gson.Gson;
import hackbgu.bgu.ac.il.model.requestBody.InsertEventBody;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class InsertEventServlet extends HttpServlet {

    final static Logger LOG = LoggerFactory.getLogger(InsertEventServlet.class);

    /**
     *
     */
    private static final long serialVersionUID = -1598336877581962216L;

    /**
     * Handling post request for inserting new event
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        InsertEventBody insertEventBody = createInsertBody(request);

        Map<String, String> eventData = insertEventBody.data;

        if(SaveServlet.bprog != null) {
            SaveServlet.bprog.enqueueExternalEvent(new BEvent(insertEventBody.eventName,
                    eventData));
        }
    }

    /**
     * Handling get request
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/xml;charset=UTF-8");
        response.setHeader("Pragma", "no-cache"); // HTTP 1.0
        response.setHeader("Cache-control", "private, no-cache, no-store");
        response.setHeader("Expires", "0");

        // response.getWriter().println(createGraph(request));
        response.setStatus(HttpServletResponse.SC_OK);
    }

    /**
     * Handling post body request with insert event
     * @param request
     * @return
     * @throws IOException
     */
    private InsertEventBody createInsertBody(HttpServletRequest request) throws IOException {
        String body = IOUtils.toString(request.getReader());

        Gson gson = new Gson();
        return gson.fromJson(body, InsertEventBody.class);
    }

}
