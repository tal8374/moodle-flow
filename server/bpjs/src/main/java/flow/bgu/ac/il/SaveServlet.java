package flow.bgu.ac.il;
/**
 * Copyright (c) 2011-2012, JGraph Ltd
 */

import com.google.gson.Gson;
import flow.bgu.ac.il.model.program.Program;
import flow.bgu.ac.il.model.requestBody.SaveBody;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.BProgramRunnerListenerAdapter;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.StringBProgram;
import org.apache.commons.io.IOUtils;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class SaveServlet.
 * <p>
 * The SaveDialog in Dialogs.js implements the user interface. Editor.saveFile
 * in Editor.js implements the request to the server. Note that this request
 * is carried out in a separate iframe in order to allow for the response to
 * be handled by the browser. (This is required in order to bring up a native
 * Save dialog and save the file to the local filestyem.) Finally, the code in
 * this servlet echoes the XML and sends it back to the client with the
 * required headers (see Content-Disposition in RFC 2183).
 */
public class SaveServlet extends HttpServlet {

    {
        System.out.println("SaveServlet is active");
    }

    /**
     *
     */
    private static final long serialVersionUID = -5308353652899057537L;

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws ServletException, IOException {

        SaveBody saveBody = this.createSaveBody(request);

        BProgramRunner rnr = this.createBProgramRunner(saveBody.flow);

        Program program = Program.getInstance();
        program.addUser(saveBody.userEmail);
        program.addProgramToUser(saveBody.userEmail, rnr, saveBody.flowID);
        program.startBPProgramRunner(saveBody.userEmail, saveBody.flowID);

        response.setStatus(HttpServletResponse.SC_OK);
    }

    private SaveBody createSaveBody(HttpServletRequest request) throws IOException {
        String body = IOUtils.toString(request.getReader());
        body = String.join("", body.split("\n"));

        Gson gson = new Gson();
        return gson.fromJson(body, SaveBody.class);
    }

    private BProgramRunner createBProgramRunner(String flow) {
        BProgram bprog = new StringBProgram(flow);

        BProgramRunner rnr = new BProgramRunner(bprog);

        rnr.addListener(new PrintBProgramRunnerListener());
        rnr.addListener(new BProgramRunnerListenerAdapter() {

            @Override
            public void eventSelected(BProgram bp, BEvent theEvent) {
                System.out.println(theEvent);
            }

        });

        return rnr;
    }


}