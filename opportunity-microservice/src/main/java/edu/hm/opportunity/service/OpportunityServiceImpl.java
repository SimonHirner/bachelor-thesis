package edu.hm.opportunity.service;

import edu.hm.opportunity.OpportunityApplication;
import edu.hm.opportunity.common.BadRequestException;
import edu.hm.opportunity.common.ResourceNotFoundException;
import edu.hm.opportunity.persistence.Opportunity;
import edu.hm.opportunity.persistence.OpportunityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

/**
 * Opportunity service implementation.
 *
 * @author Simon Hirner
 */
@Service
public class OpportunityServiceImpl implements OpportunityService {

    private static final Logger logger = LoggerFactory.getLogger(OpportunityApplication.class);

    private final OpportunityRepository opportunityRepository;

    public OpportunityServiceImpl(OpportunityRepository opportunityRepository) {
        this.opportunityRepository = opportunityRepository;
    }

    @Override
    public List<Opportunity> getAllOpportunities() {
        logger.debug("Find all opportunities");
        return opportunityRepository.findAllByOrderByEstimatedCloseDateAscIdAsc();
    }

    @Override
    public Optional<Opportunity> getOpportunity(String id) {
        logger.debug("Find opportunity {}", id);
        return opportunityRepository.findById(id);
    }

    @Override
    public Opportunity saveOpportunity(Opportunity newOpportunity) {
        if (newOpportunity.getRelatedContactId() == null || newOpportunity.getRelatedContactId().isEmpty()) {
            logger.debug("Save new interaction");
            return opportunityRepository.save(newOpportunity);
        }

        logger.debug("Verify contact ID");
        String contactService = System.getenv().getOrDefault("CONTACT_SERVICE", "localhost:8080");
        String contactApi = "http://" + contactService + ":8080/contacts/" + newOpportunity.getRelatedContactId();
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(contactApi, String.class);
            if (response.getStatusCode().equals(HttpStatus.OK)) {
                logger.debug("Save new opportunity");
                return opportunityRepository.save(newOpportunity);
            }
        } catch (Exception exception) {
            throw new BadRequestException("Contact ID is invalid");
        }
        throw new BadRequestException("Contact ID could not be verified");
    }

    @Override
    public Opportunity replaceOpportunity(String id, Opportunity newOpportunity) {
        logger.debug("Replace opportunity {}", id);
        return getOpportunity(id)
                .map(opportunity -> {
                    opportunity.setBudget(newOpportunity.getBudget());
                    opportunity.setDiscount(newOpportunity.getDiscount());
                    opportunity.setEstimatedCloseDate(newOpportunity.getEstimatedCloseDate());
                    opportunity.setNote(newOpportunity.getNote());
                    opportunity.setStatus(newOpportunity.getStatus());
                    opportunity.setValue(newOpportunity.getValue());
                    opportunity.setRelatedContactId(newOpportunity.getRelatedContactId());
                    return saveOpportunity(opportunity);
                })
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }

    @Override
    public void deleteOpportunity(String id) {
        logger.debug("Delete opportunity {}", id);
        opportunityRepository.deleteById(getOpportunity(id).orElseThrow(() -> new ResourceNotFoundException(id)).getId());
    }

    @Override
    public void deleteAllOpportunities() {
        logger.debug("Delete all opportunities");
        opportunityRepository.deleteAll();
    }

}
